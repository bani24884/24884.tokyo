import * as React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import Seo from "../components/seo"

const PrivacyPolicy_ja = ({ data, location }) => {
  const siteTitle = data.site.siteMetadata?.title || `Title`
  return (
    <Layout location={location} title={siteTitle}>
      <Seo title="Privacy Policy" />			      
      <p>日本語のはプライバシーポリシーは<a href = '/privacypolicy_ja/'>こちら</a></p>


      <p>At 24884.tokyo (<a href="https://24884.tokyo/">24884.tokyo</a>), the privacy of our visitors is extremely important. This Privacy Policy outlines the types of personal information that is received and collected and how it is used.</p>
      
      
      
      <p>This Privacy Policy is reviewed and revised from time to time. You will want to revisit it regularly. Your use of this site, in any and all forms, constitutes an acceptance of this Privacy Policy.</p>
      
      
      
      <p><strong>1. Log Files</strong></p>
      
      
      
      <p>We use log files like many other websites. The information in the log files include:</p>
      
      
      
      <ul><li>Internet Protocol addresses (IP)</li><li>Types of browser</li><li>Internet Service Provider (ISP)</li><li>Date and time stamp</li><li>Referring and exit pages</li><li>Number of clicks</li></ul>
      
      
      
      <p>All of this information is not linked to anything that is personally identifiable.</p>
      
      
      
      <p><strong>2. Cookies</strong></p>
      
      
      
      <p>We use cookies to store information about visitor preferences and to record user-specific information on visits and pages the user views so as to provide a custom experience. In regard to third-party advertisers, 24884.tokyo has no access or control over these cookies. You should review the respective privacy policies on any and all third-party ad servers for more information regarding their practices and how to opt-out.</p>
      
      
      
      <p>If you wish to disable cookies you may do so through your web browser options. Instructions for doing so and for other cookie-related management can be found on the specific web browsers’ websites.</p>
      <p>If you require any more information or have any questions about our privacy policy, please feel free to contact us <a href = '/contact/'>here</a></p>
      


    </Layout>
  )
}

export default PrivacyPolicy_ja

export const pageQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
    allMarkdownRemark(sort: { fields: [frontmatter___date], order: DESC }) {
      nodes {
        excerpt
        fields {
          slug
        }
        frontmatter {
          date(formatString: "MMMM DD, YYYY")
          title
          description
        }
      }
    }
  }
`