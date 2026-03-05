interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props) {
  const { slug } = params;

  // Mock product data - in real app, fetch from API
  const productName = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${productName} - H's shoucangpu`,
    description: `Mua ${productName} chính hãng với giá tốt nhất. Bảo hành 12 tháng, giao hàng miễn phí toàn quốc.`,
    keywords: `${productName}, starbucks, ly starbucks, cups, tumbler`,
    openGraph: {
      title: `${productName} - H's shoucangpu`,
      description: `Mua ${productName} chính hãng với giá tốt nhất`,
      type: "website",
      locale: "vi_VN",
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default function ProductLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
