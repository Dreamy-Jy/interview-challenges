import { headers } from "next/headers";
import Mobile from "./components/Mobile";
import Desktop from "./components/Desktop";

async function isMobileDevice() {
  const userAgent = (await headers()).get("user-agent");

  if (!userAgent) return false;

  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)
}

export default async function Home() {
  const loadMobile = await isMobileDevice();

  if (loadMobile && false) {
    console.log("Loading mobile version");
    return <Mobile />;
  }
  
  console.log("Not a mobile device");
  return <Desktop />;
}
