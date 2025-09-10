import { Dialog } from '@progress/kendo-react-dialogs';
import { useEffect, useState } from 'react';
import { useConfig } from './ConfigProvider';
import { DropDownList } from '@progress/kendo-react-dropdowns';


export const DialogForm = ({ visible, onClose, onSubmit, initialData } : any) => {
  const { config } = useConfig();
  const [formData, setFormData] = useState(initialData || { programName : '', cust : '', description : '', updates: '', type: ''  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (e : any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e : any) => {
    setFormData({ ...formData, type: e.value });
  };
  const handleSave = () => {
    onSubmit(formData);
    onClose();
  };

  return (
    visible && (
      <Dialog title="Update Info" onClose={onClose}>
        <form>
          <div>
            <label>Program Name:</label>
            <input name="programName" value={formData.programName} onChange={handleChange} required={true}/>
          </div>
          <div>
            <label>Customer:</label>
            <input name="cust" value={formData.cust} onChange={handleChange} required={true}/>
          </div>
          <div>
            <label>Description:</label>
            <input name="description" value={formData.description} onChange={handleChange} required={true}/>
          </div>
          <div>
            <label>Updates to TTM:</label>
            <input name="updates" value={formData.updates} onChange={handleChange} />
          </div>
          <div>
            <label>Type:</label>
            <DropDownList data={config?.globalTypesForForm} value={formData.type} onChange={handleTypeChange} required={true}/>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <button type="button" onClick={handleSave}>Save</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </Dialog>
    )
  );
};
