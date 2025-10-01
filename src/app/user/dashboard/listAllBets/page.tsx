import { ListAllBets } from "@/components/listAllBets/ListAllBets";
import { MenuBar } from "@/components/menuBar/MenuBar";

export default function Page() {
    return (
        <>
            <main className="container-main">
                <MenuBar />
                <ListAllBets />
            </main>
        </>
    )
}