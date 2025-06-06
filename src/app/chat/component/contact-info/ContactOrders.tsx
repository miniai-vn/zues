import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Order {
  id: string;
  date: string;
  status: 'completed' | 'shipping' | 'pending';
  items: string;
  amount: string;
}

interface ContactOrdersProps {
  orders?: Order[];
}

const defaultOrders: Order[] = [
  {
    id: "#DH001234",
    date: "20/05/2024",
    status: "completed",
    items: "Áo thun cotton x2",
    amount: "450,000 VNĐ"
  },
  {
    id: "#DH001235",
    date: "18/05/2024",
    status: "shipping",
    items: "Giày sneaker x1",
    amount: "1,200,000 VNĐ"
  }
];

const getStatusBadge = (status: Order['status']) => {
  switch (status) {
    case 'completed':
      return <Badge variant="outline" className="text-xs">Hoàn thành</Badge>;
    case 'shipping':
      return <Badge variant="secondary" className="text-xs">Đang giao</Badge>;
    case 'pending':
      return <Badge variant="destructive" className="text-xs">Đang chờ</Badge>;
    default:
      return <Badge variant="outline" className="text-xs">{status}</Badge>;
  }
};

export const ContactOrders = ({ orders = defaultOrders }: ContactOrdersProps) => {
  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Card key={order.id}>
          <CardContent className="p-3">
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-sm">{order.id}</p>
                <p className="text-xs text-muted-foreground">{order.date}</p>
              </div>
              {getStatusBadge(order.status)}
            </div>
            <p className="text-sm text-muted-foreground">{order.items}</p>
            <p className="text-sm font-semibold text-right">{order.amount}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
