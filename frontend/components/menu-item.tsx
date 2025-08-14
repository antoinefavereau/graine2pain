export interface MenuItemProps {
  item: {
    href: string;
    icon: string;
    label: string;
  };
}

export default function MenuItem({ item }: MenuItemProps) {
  return (
    <a
      href={item.href}
      className="group relative block p-6 text-light text-shadow-white hover:text-white hover:text-shadow-[0_0_2px] transition-all duration-300 ease-in-out"
    >
      <span className="material-symbols-outlined !text-3xl group-hover:scale-60 group-hover:-translate-y-1/4 transition-transform duration-300 ease-in-out">
        {item.icon}
      </span>
      <span className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 text-xs opacity-0 translate-y-1/2 group-hover:bottom-6 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 ease-in-out">
        {item.label}
      </span>
    </a>
  );
}
