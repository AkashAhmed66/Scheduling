import React from 'react';

export default function ContactsSection({ formData, handleChange }) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-bold mb-4">Contacts</h2>

      {/* Client Details */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Client</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm">Client Name</label>
            <input
              type="text"
              name="clientName"
              value={formData.clientName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">City</label>
            <input
              type="text"
              name="clientCity"
              value={formData.clientCity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Province</label>
            <input
              type="text"
              name="clientProvince"
              value={formData.clientProvince}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm">Country</label>
            <input
              type="text"
              name="clientCountry"
              value={formData.clientCountry}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Postal Code</label>
            <input
              type="text"
              name="clientPostalCode"
              value={formData.clientPostalCode}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Address</label>
            <input
              type="text"
              name="clientAddress"
              value={formData.clientAddress}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm">Tel</label>
            <input
              type="text"
              name="clientTel"
              value={formData.clientTel}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Contact Name</label>
            <input
              type="text"
              name="clientContactName"
              value={formData.clientContactName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Position</label>
            <input
              type="text"
              name="clientPosition"
              value={formData.clientPosition}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              name="clientEmail"
              value={formData.clientEmail}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Phone Number</label>
            <input
              type="text"
              name="clientPhoneNumber"
              value={formData.clientPhoneNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Vendor Details */}
      <div className="border-b pb-4 mb-4">
        <h3 className="text-lg font-semibold mb-2">Vendor</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm">Vendor Name</label>
            <input
              type="text"
              name="vendorName"
              value={formData.vendorName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">City</label>
            <input
              type="text"
              name="vendorCity"
              value={formData.vendorCity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Province</label>
            <input
              type="text"
              name="vendorProvince"
              value={formData.vendorProvince}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm">Country</label>
            <input
              type="text"
              name="vendorCountry"
              value={formData.vendorCountry}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Postal Code</label>
            <input
              type="text"
              name="vendorPostalCode"
              value={formData.vendorPostalCode}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Address</label>
            <input
              type="text"
              name="vendorAddress"
              value={formData.vendorAddress}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm">Tel</label>
            <input
              type="text"
              name="vendorTel"
              value={formData.vendorTel}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Contact Name</label>
            <input
              type="text"
              name="vendorContactName"
              value={formData.vendorContactName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Position</label>
            <input
              type="text"
              name="vendorPosition"
              value={formData.vendorPosition}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              name="vendorEmail"
              value={formData.vendorEmail}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Phone Number</label>
            <input
              type="text"
              name="vendorPhoneNumber"
              value={formData.vendorPhoneNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>

      {/* Factory Details */}
      <div>
        <h3 className="text-lg font-semibold mb-2">Factory</h3>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm">Factory Name</label>
            <input
              type="text"
              name="factoryName"
              value={formData.factoryName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">City</label>
            <input
              type="text"
              name="factoryCity"
              value={formData.factoryCity}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Province</label>
            <input
              type="text"
              name="factoryProvince"
              value={formData.factoryProvince}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm">Country</label>
            <input
              type="text"
              name="factoryCountry"
              value={formData.factoryCountry}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Postal Code</label>
            <input
              type="text"
              name="factoryPostalCode"
              value={formData.factoryPostalCode}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Address</label>
            <input
              type="text"
              name="factoryAddress"
              value={formData.factoryAddress}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm">Tel</label>
            <input
              type="text"
              name="factoryTel"
              value={formData.factoryTel}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Contact Name</label>
            <input
              type="text"
              name="factoryContactName"
              value={formData.factoryContactName}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Position</label>
            <input
              type="text"
              name="factoryPosition"
              value={formData.factoryPosition}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mt-4">
          <div>
            <label className="block text-sm">Email</label>
            <input
              type="email"
              name="factoryEmail"
              value={formData.factoryEmail}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>

          <div>
            <label className="block text-sm">Phone Number</label>
            <input
              type="text"
              name="factoryPhoneNumber"
              value={formData.factoryPhoneNumber}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
