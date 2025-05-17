import React, { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Camera, Search, Video, RefreshCw } from 'lucide-react';
import Webcam from 'react-webcam';

interface CameraCaptureProps {
  onSearch: (imageData: string) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onSearch }) => {
  const [cameraActive, setCameraActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const startCamera = () => {
    setCameraActive(true);
  };

  const captureImage = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setCameraActive(false);
      }
    }
  }, [webcamRef]);

  const retakeImage = () => {
    setCapturedImage(null);
    setCameraActive(true);
  };

  const handleSearch = () => {
    if (capturedImage) {
      onSearch(capturedImage);
    }
  };

  return (
    <div className="py-4 sm:py-6">
      <div className="w-full max-w-xl mx-auto">
        {!cameraActive && !capturedImage && (
          <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center mb-4 sm:mb-6">
            <div className="text-center p-4 sm:p-6">
              <Camera className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400 mb-2 sm:mb-3 mx-auto" />
              <p className="text-gray-500 text-xs sm:text-sm">Camera preview will appear here</p>
            </div>
          </div>
        )}

        {cameraActive && !capturedImage && (
          <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 sm:mb-6">
            <Webcam
              audio={false}
              ref={webcamRef}
              screenshotFormat="image/jpeg"
              videoConstraints={{
                facingMode: "environment"
              }}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {!cameraActive && capturedImage && (
          <div className="w-full aspect-video bg-gray-100 rounded-lg overflow-hidden mb-4 sm:mb-6">
            <img src={capturedImage} alt="Captured component" className="w-full h-full object-contain" />
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-4">
          {!cameraActive && !capturedImage && (
            <Button onClick={startCamera} variant="secondary" className="w-full sm:w-auto">
              <Video className="mr-2 h-4 w-4" />
              Start Camera
            </Button>
          )}
          
          {cameraActive && !capturedImage && (
            <Button onClick={captureImage} className="bg-primary hover:bg-red-700 w-full sm:w-auto">
              <Camera className="mr-2 h-4 w-4" />
              Capture Image
            </Button>
          )}
          
          {!cameraActive && capturedImage && (
            <Button onClick={retakeImage} variant="outline" className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" />
              Retake
            </Button>
          )}
        </div>
        
        {!cameraActive && capturedImage && (
          <div className="mt-4 sm:mt-6 flex justify-center">
            <Button onClick={handleSearch} className="bg-primary hover:bg-red-700 w-full sm:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Search Components
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraCapture;
