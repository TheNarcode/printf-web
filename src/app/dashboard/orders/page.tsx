import OrdersScreen from '../../../components/app-screens/OrdersScreen';
export default function Page({ searchParams }: { searchParams: any }) { 
  return <OrdersScreen initialFilter={searchParams.filter} />; 
}
