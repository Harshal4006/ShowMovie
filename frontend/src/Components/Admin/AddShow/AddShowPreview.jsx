const AddShowPreview = () => {
  return (
    <div className="mt-6 rounded-xl bg-gray-900 border border-gray-800 p-5 sm:p-6">
      <h3 className="text-lg font-semibold mb-4">Show Preview</h3>
      <p className="text-sm text-gray-400 mb-5">
        After submission, the show will appear in the list and be available for booking.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-lg border border-gray-800 p-4 bg-gray-800/30">
          <div className="text-xs text-gray-500 mb-1">Theater</div>
          <div className="text-base font-semibold">PVR Cinemas</div>zzzzz
        </div>
        <div className="rounded-lg border border-gray-800 p-4 bg-gray-800/30">
          <div className="text-xs text-gray-500 mb-1">Screen Type</div>
          <div className="text-base font-semibold">IMAX</div>
        </div>
        <div className="rounded-lg border border-gray-800 p-4 bg-gray-800/30">
          <div className="text-xs text-gray-500 mb-1">Expected Revenue</div>
          <div className="text-base font-semibold text-green-400">₹2,500 - ₹3,000</div>
        </div>
      </div>
    </div>
  );
};

export default AddShowPreview;