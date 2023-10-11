import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
} from '@mui/material';
import PropTypes from 'prop-types';
import { deleteProduct } from '../../services/dashboard-services';

const DeleteDialog = (props) => {
  const { onClose, productName, productId, open, onProductDeleted, ...other } =
    props;

  const handleCancel = () => {
    onClose();
  };

  const handleOk = async () => {
    try {
      const message = await deleteProduct(productId);
      if (message) {
        onProductDeleted();
      }
    } catch (err) {
      console.log(err);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} {...other}>
      <DialogTitle color='error.main'>
        {'Warning: Delete Product?'}{' '}
      </DialogTitle>
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete the product named {productName}? This
          action cannot be undone.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleOk} sx={{ '&:hover': { color: 'error.main' } }}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DeleteDialog.propTypes = {
  onClose: PropTypes.func.isRequired,
  onProductDeleted: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  productName: PropTypes.string.isRequired,
  productId: PropTypes.string.isRequired,
};

export default DeleteDialog;
