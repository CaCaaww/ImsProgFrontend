import { useEffect, useState} from 'react';
import { useNavigate} from 'react-router-dom';
import { Drawer, DrawerContent, type DrawerSelectEvent } from '@progress/kendo-react-layout';
import { Button } from '@progress/kendo-react-buttons';
import { menuIcon } from '@progress/kendo-svg-icons';
import { useLocation } from 'react-router-dom';
import { useConfig } from '../otherStuff/ConfigProvider';



const DrawerContainer = (props: { children: unknown; }) => {
    const { config } = useConfig();
    const [items, setItems] = useState([
    { text: 'Home', route: '/home' },
    { text: 'Data', route: '/data' },
    { text: 'Create', disabled: true, route: '/create'},
    { text: 'Delete Archive', disabled: true, route: '/archive'},
    { separator: true },
    { text: 'Logout', disabled: false,  route: '/' },
    ]);
    const navigate = useNavigate();
    const [expanded, setExpanded] = useState<boolean>(true);
    const [selected, setSelected] = useState(items.findIndex((x) => x.route === useLocation().pathname));
    useEffect(() => {
        if (!config?.globalUserGroups) return;
        //console.log(globalUserGroups)
        config.globalUserGroups.forEach(element => {
            if (element == "IMSADMIN"){
                setItems(prevItems =>
                    prevItems.map(item => {
                        if (item.text === 'Create'){
                            return { ...item, disabled: false}
                        } else if (item.text === 'Delete Archive'){
                            return {...item, disabled: false}
                        } else {
                            return item
                        }
                    })
                 );
            }
        });
    }, [config?.globalUserGroups])
    

    const handleClick = () => {
        setExpanded(!expanded);
    };

    const onSelect = (e: DrawerSelectEvent) => {
        if (e.itemTarget.props.route == "/"){
            sessionStorage.clear();
        }
        navigate(e.itemTarget.props.route);
        setSelected(e.itemIndex);
    };


    return (
        <div>
            <div className="custom-toolbar">
                <Button svgIcon={menuIcon} fillMode="flat" onClick={handleClick} />
                <span className="title"></span>
            </div>
            <Drawer
                expanded={expanded}
                position={'start'}
                mode={'push'}
                width={150}
                items={items.map((item, index) => ({
                    ...item,
                    selected: index === selected
                }))}
                onSelect={onSelect}
            >
                <DrawerContent>{props.children}</DrawerContent>
            </Drawer>
        </div>
    );

};
export default DrawerContainer;