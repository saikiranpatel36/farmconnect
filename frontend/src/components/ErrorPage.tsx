function ErrorPage() {
  return (
    <div className="container d-flex justify-content-center align-items-center error-main">
      <div className="card shadow-lg border-0 rounded w-50">
        <div className="error-container">
          <div className="error-icon-circle">
            <i className="bi bi-exclamation-triangle-fill"></i>
          </div>
          <h2 className="mt-3">Oops! Something Went Wrong</h2>
          <p className="text-muted">Please try again later.</p>
        </div>
      </div>
    </div>
  );
}

export default ErrorPage;
