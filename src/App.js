import React, { useState } from 'react';
import FileUpload from './FileUpload';
import ValidationForm from './ValidationForm';
import './App.css';

function App() {
  const [invoiceData, setInvoiceData] = useState(null);
  const [workflowId, setWorkflowId] = useState(null);
  const [fileForPreview, setFileForPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUploadSuccess = (data, file) => {
    const { wf_id, ...invoiceFields } = data;
    setInvoiceData(invoiceFields);
    setWorkflowId(wf_id);
    setFileForPreview(file);
    setError(null);
  };

  const handleReset = () => {
    setInvoiceData(null);
    setWorkflowId(null);
    setFileForPreview(null);
    setError(null);
    setLoading(false);
  };

  return (
    <div className="App">
      <main className="content">
        <div className="container-fluid my-5">
          <div className="row justify-content-center">
            <div className="col-lg-11 col-xl-10">
              <div className="card shadow-lg border-0">
                <div className="card-header bg-primary text-white text-center">
                  <h1 className="h3 mb-0">Validador de Facturas</h1>
                </div>
                <div className="card-body p-4 p-md-5">
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <strong>Error:</strong> {error}
                    </div>
                  )}
                  {loading ? (
                    <div className="text-center py-5">
                      <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                      </div>
                      <p className="mt-3">Procesando factura...</p>
                    </div>
                  ) : !invoiceData ? (
                    <div className="row justify-content-center">
                      <div className="col-lg-8">
                        <FileUpload
                          onSuccess={handleFileUploadSuccess}
                          onError={setError}
                          setLoading={setLoading}
                        />
                      </div>
                    </div>
                  ) : (
                    <ValidationForm
                      initialData={invoiceData}
                      workflowId={workflowId}
                      fileForPreview={fileForPreview}
                      onReset={handleReset}
                      onError={setError}
                    />
                  )}
                </div>
              </div>
              <footer className="text-center text-muted mt-4">
                <p>&copy; {new Date().getFullYear()} - Orbitalia</p>
              </footer>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;

