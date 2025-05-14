import { Outlet } from "react-router";

export default function RootTemplate(){
    return (
        <div>
            <h1>Hello</h1>
            <div>
                <Outlet/>
            </div>
        </div>
    )
}