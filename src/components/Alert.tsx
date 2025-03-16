import Alert from '@mui/material/Alert';
import CheckIcon from '@mui/icons-material/Check';

interface SimpleAlertProps {
    message: string;
    severity?: "success" | "error" | "warning" | "info";
}


export default function SimpleAlert({message, severity}: SimpleAlertProps) {
  return (
    <Alert icon={<CheckIcon fontSize="inherit" />} severity={severity}>
        {message}
    </Alert>
  );
}
