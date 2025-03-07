const ComponentContainerCard = ({ title, children }) => {
  return (
    <div className="rounded-lg border border-default-200 bg-white dark:bg-default-50">
      <div className="border-b border-default-200 px-6 py-3">
        <h4 className="text-lg text-default-900">{title}</h4>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default ComponentContainerCard;
