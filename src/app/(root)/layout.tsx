import StreamClientProvider from "@/components/providers/StreamClientProvider";

function Layout ({children}:{children: React.ReactNode}){
    return(
        <StreamClientProvider>
            {children}
        </StreamClientProvider>
    )
}

export default Layout


//we use StreamClientProvider in whole root since we use child if we 
// do this is app layout then we use this in (admin) also but we want only in (root)