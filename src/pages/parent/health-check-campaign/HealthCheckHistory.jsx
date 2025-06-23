import FloatingFilterBar from "../../../components/parent/FloatingFilterBar";

const HealthCheckHistory = () => {

  const children = ['Anna Nguyen', 'Liam Tran', 'Sophie Le'];
  const years = ['2023', '2024', '2025'];

  return (
    <div>
      {/* Other content */}
      <FloatingFilterBar childrenList={children} yearList={years} />
    </div>
  );
}

export default HealthCheckHistory;
