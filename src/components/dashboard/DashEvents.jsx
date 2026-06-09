import "@assets/scss/dashboard.scss";

export const DashEvents = ({ title, children }) => {
  return (
    <div className='dash_wrap'>
      <div className='title_wrap'>
        <p className='title'>{title}</p>
      </div>
      <div className='graph_wraps'>
        {children}
      </div>
    </div>
  )
}
