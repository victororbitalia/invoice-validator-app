import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const FileUpload = ({ onSuccess, onError, setLoading }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setSelectedFile(acceptedFiles[0]);
      onError(null);
    }
  }, [onError]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/jpeg': ['.jpeg', '.jpg'],
      'image/png': ['.png'],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!selectedFile) {
      onError('Por favor, selecciona un archivo primero.');
      return;
    }

    const uploadUrl = '/api/webhook/a774c7b0-84ba-4092-b43c-43279a0104a3';
    const formData = new FormData();
    formData.append('file', selectedFile);

    setLoading(true);
    onError(null);

    try {
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const responseData = response.data.json;

      if (responseData && responseData.wf_id) {
        onSuccess(responseData);
      } else {
        onError('La respuesta del servidor no es válida o no contiene "wf_id".');
        console.error("Respuesta inválida:", response.data);
      }
    } catch (error) {
      console.error('Error detallado al subir:', error);
      let errorMessage = 'Ocurrió un error al conectar con el servidor.';
      if (error.response) {
        errorMessage = `Error del servidor: ${error.response.status}. Intenta de nuevo.`;
      }
      onError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center">
      <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
        <input {...getInputProps()} />
        <i className="bi bi-cloud-arrow-up-fill" style={{ fontSize: '4rem', color: '#0d6efd' }}></i>
        {isDragActive ? (
          <p className="mt-3">Suelta la factura aquí...</p>
        ) : (
          <p className="mt-3">Arrastra una factura o haz clic para seleccionarla</p>
        )}
      </div>
      {selectedFile && (
        <div className="mt-3">
          <p className="mb-2"><strong>Archivo seleccionado:</strong> {selectedFile.name}</p>
        </div>
      )}
      <button 
        className="btn btn-primary btn-lg mt-4" 
        onClick={handleUpload} 
        disabled={!selectedFile}
      >
        Subir y Extraer Datos
      </button>
    </div>
  );
};

export default FileUpload;

