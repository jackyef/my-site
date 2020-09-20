export const PageContainer: React.FC = ({ children }) => {
  return (
    <div className="animate-flyInTop">
      {children}
    </div>
  )
}