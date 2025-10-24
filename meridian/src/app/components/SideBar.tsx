import { Badge } from "@/components/ui/badge";
import { LucideIcon } from "lucide-react";


export type PageLinkProps = {
    icon: LucideIcon;
    assetCount: number;
    title: string;
    selected: boolean;
    onClick?: () => void;
};
export function PageLink({ icon, assetCount, title, selected, onClick }: PageLinkProps) {
    const Icon = icon;
    return (
        <div onClick={onClick} className={`flex items-center justify-between ${selected ? "bg-[#c8c8c9]" : "hover:bg-[#00000014]"} p-[6px] font-normal`}>
            <div className="flex gap-2 items-center font-semibold">
                {<Icon className="size-[20px] inline-block"/>}
                <p>{title}</p>
            </div>
            <Badge variant="outline"
                className="rounded-none size-6 px-1 font-mono tabular-nums text-black font-bold">{assetCount}</Badge>
        </div>
    );
}

export type SidebarProps = {
    pageLinks?: PageLinkProps[];
    title?: string;
};
export function SideBar({title, pageLinks}: SidebarProps) {
    return (
        // This needs a max width
        <aside className="bg-transparent w-[10vw]">
            <h2 className="text-xl mb-4">{title}</h2>
            {pageLinks?.map((props, index) => (
                <PageLink key={index} {...props} />
            ))}
        </aside>
    );
}