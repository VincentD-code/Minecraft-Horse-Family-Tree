import { Horse } from "@/types/horse";

interface HorseEditFormProps {
    formData: Horse;
    onChange: (updatedHorse: Horse) => void;
    onSubmit: () => void;
}

export default function HorseEditForm({ formData, onChange, onSubmit }: HorseEditFormProps){
return (
  <div>
    <h2>Edit Horse</h2>
    {/* Form fields for editing horse details would go here */}
    <p>This is a placeholder for the horse edit form.</p>
  </div>
);
}