import dynamic from "next/dynamic"
import React from "react"

const NonSSRWrapper = (props: {
    children: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined
  }) => ( 
  <React.Fragment>{props.children}</React.Fragment> 
) 
export default dynamic(() => Promise.resolve(NonSSRWrapper), { 
  ssr: false 
})