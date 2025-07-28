import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ValidationForm = ({ initialData, workflowId, onReset, onError }) => {
  const [formData, setFormData] = useState(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState(null);

  useEffect(() => {
    setFormData(initialData);
  }, [initialData]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    onError(null);

    const payload = { json: formData };
    const relativeUrl = new URL(workflowId).pathname;

    try {
      const validationUrl = `https://orbitalia-n8n.zw2zr7.easypanel.host${relativeUrl}`;
      await axios.post(validationUrl, payload);
      setSubmissionMessage('¡Validación completada con éxito!');
      setTimeout(() => {
        onReset();
      }, 2000);
    } catch (error) {
      console.error('Error detallado al validar:', error);
      let errorMessage = 'Ocurrió un error al enviar la validación.';
      if (error.response) {
        errorMessage = `Error del servidor: ${error.response.status}. Intenta de nuevo.`;
      }
      onError(errorMessage);
      setIsSubmitting(false);
    }
  };

  if (submissionMessage) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
        <h4 className="mt-3">{submissionMessage}</h4>
        <p>Reiniciando para la siguiente factura...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-center mb-4">Fase 2: Verificación y Validación</h2>
      <form onSubmit={handleSubmit}>
        <div className="row g-3">
          {Object.entries(formData).map(([key, value]) => (
            <div className="col-md-6" key={key}>
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id={key}
                  name={key}
                  value={value || ''}
                  onChange={handleChange}
                  placeholder={key.replace(/_/g, ' ')}
                />
                <label htmlFor={key} className="text-capitalize">{key.replace(/_/g, ' ')}</label>
              </div>
            </div>
          ))}
        </div>
        <div className="d-grid gap-2 d-md-flex justify-content-md-between mt-4">
          <button type="button" className="btn btn-outline-secondary" onClick={onReset} disabled={isSubmitting}>
            <i className="bi bi-arrow-left me-2"></i>Empezar de Nuevo
          </button>
          <button type="submit" className="btn btn-success btn-lg" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Validando...
              </>
            ) : (
              <>
                <i className="bi bi-check-lg me-2"></i>VALIDAR
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ValidationForm;

