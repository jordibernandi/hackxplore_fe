import React, { useState } from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail } from 'lucide-react';
import { ComponentResult, EmailData } from '@/lib/types';

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedComponents: ComponentResult[];
  onSendEmail: (data: EmailData) => void;
}

const EmailModal: React.FC<EmailModalProps> = ({
  isOpen,
  onClose,
  selectedComponents,
  onSendEmail
}) => {
  const [recipient, setRecipient] = useState('');
  const [subject, setSubject] = useState('Component Alternatives from Würth Elektronik');
  const [message, setMessage] = useState('');

  const handleSendEmail = () => {
    if (!recipient.trim()) return;

    onSendEmail({
      recipient,
      subject,
      message,
      selectedComponents
    });

    // Reset form
    setRecipient('');
    setMessage('');
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 rounded-full bg-primary/20 items-center justify-center">
              <Mail className="h-5 w-5 text-primary" />
            </div>
            <DialogTitle className="text-lg">Email Selected Results</DialogTitle>
          </div>
          <DialogDescription>
            Send the selected component information to your customer.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div>
            <Label htmlFor="email-recipient">Recipient Email</Label>
            <Input
              id="email-recipient"
              type="email"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email-subject">Subject</Label>
            <Input
              id="email-subject"
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="email-message">Message</Label>
            <Textarea
              id="email-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1"
              placeholder="Add a personalized message to your customer..."
            />
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            className="bg-primary hover:bg-red-700"
            disabled={!recipient.trim()}
            onClick={handleSendEmail}
          >
            Send Email
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EmailModal;
