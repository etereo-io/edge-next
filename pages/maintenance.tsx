import Layout from '@components/layout/normal/layout'
import config from '@lib/config'

const Maintenance = () => {
  return (
    <>
      <Layout
        title={`${config.title} - ${config.slogan}`}
        description={config.description}
        
      >
        <h1>Site under maintenace <i className="las la-tools"></i></h1>
        
        <p>Please, come back soon.</p>
      </Layout>
      <style jsx>{`
        
      `}</style>
    </>
  )
}

export default Maintenance
