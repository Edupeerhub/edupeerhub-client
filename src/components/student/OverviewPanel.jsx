const OverviewPanel = ({ icon, text }) => {
  return (
    <div className="bg-[#F9FAFB] rounded-lg  p-4 h-28 flex flex-col justify-center border">
      <img src={icon} alt="Streak" className="w-10 h-10 mb-1" />
      <p className="text-gray-500 text-base">{text}</p>
      <p className="text-xs font-medium italic">coming soon</p>
    </div>
  );
};

export default OverviewPanel;
