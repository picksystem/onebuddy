import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '@bandi/hooks';
import { constants } from '@bandi/utils';

const useCreateManagement = () => {
  const navigate = useNavigate();
  const { AdminPath } = constants;
  const [selectedType, setSelectedType] = useState<string>('');
  const notify = useNotification();

  const handleEnterDetails = () => {
    if (!selectedType) {
      notify.warning('Please select a management type before continuing.');
      return;
    }
    navigate(AdminPath.CREATE_MANAGEMENT_TYPE.replace(':type', selectedType));
  };

  const handleCancelCreation = () => {
    setSelectedType('');
    navigate(AdminPath.DASHBOARD);
  };

  return {
    selectedType,
    setSelectedType,
    handleEnterDetails,
    handleCancelCreation,
  };
};

export default useCreateManagement;
