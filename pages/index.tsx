// pages/index.tsx

export async function getServerSideProps() {
  return {
    redirect: {
      destination: "https://yesviral.com", // Change this to your real main domain
      permanent: false, // Set to true if this is a permanent redirect
    },
  };
}

export default function Home() {
  // Nothing ever renders, instant redirect
  return null;
}
