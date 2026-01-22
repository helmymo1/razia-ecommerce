import { Helmet } from 'react-helmet-async';

interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string;
}

const Meta = ({ title, description, keywords }: MetaProps) => {
  return (
    <Helmet>
      <title>{title ? `${title} | Razia Chic` : 'Razia Chic | Modern Fashion'}</title>
      <meta name="description" content={description || 'Discover the latest trends in fashion with Razia Chic. Shop our exclusive collection.'} />
      <meta name="keyword" content={keywords || 'fashion, clothing, trendy, razia chic, style'} />
    </Helmet>
  );
};

export default Meta;
