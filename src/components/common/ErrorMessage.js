import React from 'react';
import { Alert } from 'react-bootstrap';

const ErrorMessage = ({ message }) => {
  return (
    <Alert variant="danger" className="my-3">
      {message || 'An error occurred. Please try again.'}
    </Alert>
  );
};

export default ErrorMessage;