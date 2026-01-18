import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error: Error;
  resetErrorBoundary: () => void;
}

const ErrorFallback: React.FC<ErrorFallbackProps> = ({ error, resetErrorBoundary }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-background text-foreground text-center">
      <div className="bg-destructive/10 p-4 rounded-full mb-6">
        <AlertTriangle className="w-12 h-12 text-destructive" />
      </div>
      <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
      <p className="text-muted-foreground mb-6 max-w-md">
        We apologize for the inconvenience. An unexpected error has occurred.
        <br />
        <span className="text-sm font-mono mt-2 inline-block bg-muted px-2 py-1 rounded">
          {error.message || 'Unknown Error'}
        </span>
      </p>
      <Button 
        onClick={resetErrorBoundary}
        size="lg"
        className="gap-2"
      >
        <RefreshCw className="w-4 h-4" />
        Try Again
      </Button>
    </div>
  );
};

export default ErrorFallback;
