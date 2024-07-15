import './ConfirmationDialog.css'
import PropTypes from 'prop-types';

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirmation-dialog">
      <p>{message}</p>
      <button onClick={onConfirm} className="confirm-button">Yes</button>
      <button onClick={onCancel} className="cancel-button">No</button>
    </div>
  );
};

ConfirmationDialog.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default ConfirmationDialog;
