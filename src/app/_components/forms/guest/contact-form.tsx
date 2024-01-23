import { type HouseholdFormData } from "~/app/utils/shared-types";

type ContactFormProps = {
  householdFormData: HouseholdFormData;
  handleOnChange: (field: string, input: string) => void;
};

export default function ContactForm({
  householdFormData,
  handleOnChange,
}: ContactFormProps) {
  return (
    <div className="grid grid-cols-1 grid-rows-[repeat(5,50px)] gap-3">
      <input
        className="w-100 border p-3"
        placeholder="Street Address"
        value={householdFormData.address1}
        onChange={(e) => handleOnChange("address1", e.target.value)}
      />
      <input
        className="w-100 border p-3"
        placeholder="Apt/Suite/Other"
        value={householdFormData.address2}
        onChange={(e) => handleOnChange("address2", e.target.value)}
      />
      <div className="flex gap-3">
        <input
          className="w-1/2 border p-3"
          placeholder="City"
          value={householdFormData.city}
          onChange={(e) => handleOnChange("city", e.target.value)}
        />
        <select
          value={householdFormData.state}
          onChange={(e) => handleOnChange("state", e.target.value)}
          className="w-1/4 border p-3"
        >
          <option defaultValue="State">State</option>
          <option>AL</option>
          <option>AR</option>
          <option>WY</option>
        </select>
        <input
          className="w-1/4 border p-3"
          placeholder="Zip Code"
          value={householdFormData.zipCode}
          onChange={(e) => handleOnChange("zipCode", e.target.value)}
        />
      </div>
      <select
        className="w-100 border p-3"
        value={householdFormData.country}
        onChange={(e) => handleOnChange("country", e.target.value)}
      >
        <option defaultValue="State">Country</option>
        <option>Murca</option>
        <option>Mexico</option>
        <option>Canada</option>
      </select>
      <div className="flex gap-3">
        <input
          type="tel"
          className="w-1/2 border p-3"
          placeholder="Phone"
          value={householdFormData.phone}
          onChange={(e) => handleOnChange("phone", e.target.value)}
        />
        <input
          type="email"
          className="w-1/2 border p-3"
          placeholder="Email"
          value={householdFormData.email}
          onChange={(e) => handleOnChange("email", e.target.value)}
        />
      </div>
    </div>
  );
}
