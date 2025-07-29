import {
  BarChart3,
  MessageSquare,
  Users,
  TrendingUp,
  Activity,
  Clock,
  Shield,
  Zap,
  Globe,
  UserCheck,
  MessageCircle,
  FileText,
  Image,
  Paperclip,
  Smile,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
} from "recharts";

const overviewStats = [
  {
    title: "Tổng số người dùng",
    value: "15,847",
    subValue: "2,435 đang hoạt động",
    description: "+12% so với tháng trước",
    icon: Users,
    trend: "up",
    sparklineData: [40, 35, 50, 49, 62, 69, 91, 148],
  },
  {
    title: "Tin nhắn hôm nay",
    value: "3,247",
    subValue: "24,891 tuần này",
    description: "+8.5% so với hôm qua",
    icon: MessageSquare,
    trend: "up",
    sparklineData: [20, 25, 30, 45, 32, 28, 35, 42],
  },
  {
    title: "Cuộc trò chuyện",
    value: "1,834",
    subValue: "245 nhóm chat",
    description: "1,589 cuộc trò chuyện 1-1",
    icon: MessageCircle,
    trend: "stable",
    sparklineData: [15, 18, 20, 22, 19, 25, 28, 30],
  },
  {
    title: "Người dùng online",
    value: "847",
    subValue: "Thời gian thực",
    description: "Peak: 1,205 (14:30)",
    icon: Activity,
    trend: "up",
    sparklineData: [30, 40, 35, 50, 49, 60, 70, 91],
  },
  {
    title: "Uptime hệ thống",
    value: "99.9%",
    subValue: "30 ngày qua",
    description: "Downtime: 2 phút",
    icon: Clock,
    trend: "stable",
    sparklineData: [99, 100, 99, 100, 100, 99, 100, 100],
  },
];

const messageStats = [
  { name: "Văn bản", value: 15420, color: "#8884d8", icon: FileText },
  { name: "Ảnh", value: 4850, color: "#82ca9d", icon: Image },
  { name: "File đính kèm", value: 2340, color: "#ffc658", icon: Paperclip },
  { name: "Sticker/Emoji", value: 1890, color: "#ff7300", icon: Smile },
];

const messageVolumeData = [
  { name: "T2", total: 2400, text: 1800, media: 400, files: 200 },
  { name: "T3", total: 2210, text: 1650, media: 360, files: 200 },
  { name: "T4", total: 2290, text: 1720, media: 370, files: 200 },
  { name: "T5", total: 2000, text: 1500, media: 320, files: 180 },
  { name: "T6", total: 2181, text: 1640, media: 341, files: 200 },
  { name: "T7", total: 2500, text: 1875, media: 425, files: 200 },
  { name: "CN", total: 2100, text: 1575, media: 345, files: 180 },
];

const conversationData = [
  { name: "Cuộc trò chuyện 1-1", value: 1589, color: "#8884d8" },
  { name: "Nhóm chat (3-10 người)", value: 180, color: "#82ca9d" },
  { name: "Nhóm lớn (>10 người)", value: 65, color: "#ffc658" },
];

const topGroups = [
  {
    name: "Nhóm Công việc A",
    members: 25,
    messages: 1247,
    lastActive: "2 phút trước",
  },
  {
    name: "Team Marketing",
    members: 15,
    messages: 983,
    lastActive: "5 phút trước",
  },
  { name: "Dự án X", members: 12, messages: 756, lastActive: "10 phút trước" },
  {
    name: "Support Team",
    members: 8,
    messages: 642,
    lastActive: "15 phút trước",
  },
  {
    name: "Nhóm Thiết kế",
    members: 10,
    messages: 534,
    lastActive: "30 phút trước",
  },
];

const recentUsers = [
  {
    email: "nguyen.van.a@example.com",
    name: "Nguyễn Văn A",
    created: "2024-01-15",
    status: "active",
    lastLogin: "2 phút trước",
  },
  {
    email: "tran.thi.b@example.com",
    name: "Trần Thị B",
    created: "2024-01-14",
    status: "active",
    lastLogin: "5 phút trước",
  },
  {
    email: "le.van.c@example.com",
    name: "Lê Văn C",
    created: "2024-01-13",
    status: "inactive",
    lastLogin: "2 ngày trước",
  },
  {
    email: "pham.thi.d@example.com",
    name: "Phạm Thị D",
    created: "2024-01-12",
    status: "blocked",
    lastLogin: "1 tuần trước",
  },
  {
    email: "hoang.van.e@example.com",
    name: "Hoàng Văn E",
    created: "2024-01-11",
    status: "active",
    lastLogin: "1 giờ trước",
  },
];

const securityStats = [
  {
    metric: "Đăng nhập thành công",
    value: "1,247",
    change: "+5.2%",
    icon: UserCheck,
  },
  { metric: "Đăng nhập thất bại", value: "23", change: "-12%", icon: Shield },
  { metric: "Hoạt động admin", value: "45", change: "+8%", icon: Activity },
  { metric: "Kết nối socket", value: "847", change: "+15%", icon: Zap },
];

const employeeStats = [
  {
    name: "Nguyễn Văn A",
    department: "Marketing",
    messagesCount: 1247,
    lastActive: "2 phút trước",
    status: "active",
  },
  {
    name: "Trần Thị B",
    department: "IT",
    messagesCount: 983,
    lastActive: "5 phút trước",
    status: "active",
  },
  {
    name: "Lê Văn C",
    department: "Sales",
    messagesCount: 756,
    lastActive: "10 phút trước",
    status: "active",
  },
  {
    name: "Phạm Thị D",
    department: "HR",
    messagesCount: 642,
    lastActive: "15 phút trước",
    status: "active",
  },
  {
    name: "Hoàng Văn E",
    department: "Finance",
    messagesCount: 534,
    lastActive: "30 phút trước",
    status: "active",
  },
  {
    name: "Võ Thị F",
    department: "Marketing",
    messagesCount: 423,
    lastActive: "1 giờ trước",
    status: "inactive",
  },
  {
    name: "Đặng Văn G",
    department: "IT",
    messagesCount: 312,
    lastActive: "2 giờ trước",
    status: "inactive",
  },
  {
    name: "Bùi Thị H",
    department: "Sales",
    messagesCount: 198,
    lastActive: "1 ngày trước",
    status: "inactive",
  },
  {
    name: "Lý Văn I",
    department: "HR",
    messagesCount: 87,
    lastActive: "3 ngày trước",
    status: "inactive",
  },
  {
    name: "Tôn Thị K",
    department: "Finance",
    messagesCount: 45,
    lastActive: "1 tuần trước",
    status: "inactive",
  },
];

const inactiveEmployees = [
  {
    name: "Ngô Văn L",
    department: "Marketing",
    lastActive: "2 tuần trước",
    messagesCount: 12,
  },
  {
    name: "Đinh Thị M",
    department: "IT",
    lastActive: "3 tuần trước",
    messagesCount: 8,
  },
  {
    name: "Vũ Văn N",
    department: "Sales",
    lastActive: "1 tháng trước",
    messagesCount: 5,
  },
  {
    name: "Mai Thị O",
    department: "HR",
    lastActive: "2 tháng trước",
    messagesCount: 2,
  },
  {
    name: "Cao Văn P",
    department: "Finance",
    lastActive: "3 tháng trước",
    messagesCount: 1,
  },
];

export default function Dashboard() {
  return (
    <div className="flex-1 bg-background">
      {/* Top Navigation */}
      <div className="border-b border-border bg-card">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Tổng quan hệ thống
              </h1>
              <p className="text-muted-foreground">
                Báo cáo và thống kê chi tiết về hệ thống chat
              </p>
            </div>
            <Select defaultValue="7days">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Chọn khoảng thời gian" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hôm nay</SelectItem>
                <SelectItem value="7days">7 ngày qua</SelectItem>
                <SelectItem value="30days">30 ngày qua</SelectItem>
                <SelectItem value="90days">90 ngày qua</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="h-12 p-1 bg-muted/50 border border-border/50">
              <TabsTrigger
                value="overview"
                className="px-6 py-2 text-sm font-medium"
              >
                Tổng quan
              </TabsTrigger>
              <TabsTrigger
                value="messages"
                className="px-6 py-2 text-sm font-medium"
              >
                Tin nhắn
              </TabsTrigger>
              <TabsTrigger
                value="users"
                className="px-6 py-2 text-sm font-medium"
              >
                Người dùng
              </TabsTrigger>
              <TabsTrigger
                value="conversations"
                className="px-6 py-2 text-sm font-medium"
              >
                Cuộc trò chuyện
              </TabsTrigger>
              <TabsTrigger
                value="employees"
                className="px-6 py-2 text-sm font-medium"
              >
                Nhân viên
              </TabsTrigger>
              <TabsTrigger
                value="security"
                className="px-6 py-2 text-sm font-medium"
              >
                Bảo mật
              </TabsTrigger>
            </TabsList>

            {/* Main Content */}
            <div className="p-6">
              <TabsContent value="overview" className="space-y-6 mt-0">
                {/* I. Tổng quan hệ thống - Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
                  {overviewStats.map((stat, index) => (
                    <Card key={index} className="bg-card border-border">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-card-foreground">
                          {stat.title}
                        </CardTitle>
                        <stat.icon className="h-5 w-5 text-muted-foreground" />
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-card-foreground">
                          {stat.value}
                        </div>
                        <p className="text-xs text-muted-foreground mb-2">
                          {stat.subValue}
                        </p>
                        <div className="flex items-center justify-between">
                          <p className="text-xs text-muted-foreground">
                            {stat.description}
                          </p>
                          <div className="h-8 w-16">
                            <ResponsiveContainer width="100%" height="100%">
                              <AreaChart
                                data={stat.sparklineData.map((value, i) => ({
                                  value,
                                }))}
                              >
                                <Area
                                  type="monotone"
                                  dataKey="value"
                                  stroke="hsl(var(--primary))"
                                  fill="hsl(var(--primary))"
                                  fillOpacity={0.3}
                                  strokeWidth={1}
                                />
                              </AreaChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="messages" className="space-y-6 mt-0">
                {/* II. Báo cáo tin nhắn */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Message Volume Chart */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">
                        Lượng tin nhắn theo ngày
                      </CardTitle>
                      <CardDescription>
                        Thống kê tin nhắn 7 ngày qua
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={messageVolumeData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Bar
                              dataKey="text"
                              stackId="a"
                              fill="hsl(var(--primary))"
                              name="Văn bản"
                            />
                            <Bar
                              dataKey="media"
                              stackId="a"
                              fill="hsl(var(--chart-2))"
                              name="Ảnh/Media"
                            />
                            <Bar
                              dataKey="files"
                              stackId="a"
                              fill="hsl(var(--chart-3))"
                              name="File đính kèm"
                            />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Message Types */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">
                        Loại tin nhắn
                      </CardTitle>
                      <CardDescription>
                        Phân loại tin nhắn theo định dạng
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={messageStats}
                              cx="50%"
                              cy="50%"
                              outerRadius={80}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${name} ${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {messageStats.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        {messageStats.map((stat, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: stat.color }}
                            />
                            <stat.icon className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-foreground">
                              {stat.name}: {stat.value.toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="users" className="space-y-6 mt-0">
                {/* III. Báo cáo người dùng */}
                <Card className="bg-card border-border">
                  <CardHeader>
                    <CardTitle className="text-card-foreground">
                      Người dùng gần đây
                    </CardTitle>
                    <CardDescription>
                      Danh sách người dùng và trạng thái hoạt động
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Tên</TableHead>
                          <TableHead>Trạng thái</TableHead>
                          <TableHead>Đăng nhập cuối</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recentUsers.map((user, index) => (
                          <TableRow key={index}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {user.email}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant={
                                  user.status === "active"
                                    ? "default"
                                    : user.status === "inactive"
                                    ? "secondary"
                                    : "destructive"
                                }
                              >
                                {user.status === "active"
                                  ? "Hoạt động"
                                  : user.status === "inactive"
                                  ? "Không hoạt động"
                                  : "Bị khóa"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {user.lastLogin}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="conversations" className="space-y-6 mt-0">
                {/* IV. Báo cáo cuộc trò chuyện */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Conversation Analytics */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">
                        Phân tích cuộc trò chuyện
                      </CardTitle>
                      <CardDescription>
                        Thống kê các loại cuộc trò chuyện
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-48 mb-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={conversationData}
                              cx="50%"
                              cy="50%"
                              outerRadius={60}
                              fill="#8884d8"
                              dataKey="value"
                              label={({ name, percent }) =>
                                `${(percent * 100).toFixed(0)}%`
                              }
                            >
                              {conversationData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={entry.color}
                                />
                              ))}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="space-y-2">
                        {conversationData.map((item, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="text-sm">{item.name}</span>
                            </div>
                            <span className="font-medium">{item.value}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Top Active Groups */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">
                        Top nhóm hoạt động
                      </CardTitle>
                      <CardDescription>
                        Những nhóm chat có nhiều tin nhắn nhất
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {topGroups.map((group, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-card-foreground">
                                {group.name}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {group.members} thành viên
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-medium">
                                {group.messages} tin nhắn
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {group.lastActive}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="employees" className="space-y-6 mt-0">
                {/* Thống kê nhân viên */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Nhân viên nhắn tin nhiều nhất */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">
                        Nhân viên nhắn tin nhiều nhất
                      </CardTitle>
                      <CardDescription>
                        Top 10 nhân viên có số lượng tin nhắn cao nhất
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tên nhân viên</TableHead>
                            <TableHead>Phòng ban</TableHead>
                            <TableHead>Số tin nhắn</TableHead>
                            <TableHead>Hoạt động cuối</TableHead>
                            <TableHead>Trạng thái</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {employeeStats.map((employee, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {employee.name}
                              </TableCell>
                              <TableCell>{employee.department}</TableCell>
                              <TableCell className="font-bold text-primary">
                                {employee.messagesCount.toLocaleString()}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {employee.lastActive}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    employee.status === "active"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {employee.status === "active"
                                    ? "Hoạt động"
                                    : "Không hoạt động"}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>

                  {/* Nhân viên không tương tác */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">
                        Nhân viên ít tương tác
                      </CardTitle>
                      <CardDescription>
                        Danh sách nhân viên không hoạt động trong thời gian dài
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Tên nhân viên</TableHead>
                            <TableHead>Phòng ban</TableHead>
                            <TableHead>Tin nhắn</TableHead>
                            <TableHead>Hoạt động cuối</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {inactiveEmployees.map((employee, index) => (
                            <TableRow key={index}>
                              <TableCell className="font-medium">
                                {employee.name}
                              </TableCell>
                              <TableCell>{employee.department}</TableCell>
                              <TableCell className="text-destructive font-medium">
                                {employee.messagesCount}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground">
                                {employee.lastActive}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="security" className="space-y-6 mt-0">
                {/* V. Bảo mật và VI. Hiệu suất */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Security Stats */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">
                        Bảo mật & Truy cập
                      </CardTitle>
                      <CardDescription>
                        Thống kê bảo mật và hoạt động hệ thống
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {securityStats.map((stat, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                          >
                            <stat.icon className="h-8 w-8 text-primary" />
                            <div>
                              <p className="text-lg font-bold">{stat.value}</p>
                              <p className="text-xs text-muted-foreground">
                                {stat.metric}
                              </p>
                              <p className="text-xs text-green-600">
                                {stat.change}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Platform Status */}
                  <Card className="bg-card border-border">
                    <CardHeader>
                      <CardTitle className="text-card-foreground">
                        Trạng thái nền tảng
                      </CardTitle>
                      <CardDescription>
                        Kết nối realtime với các nền tảng chat
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          "TMARK",
                          "Facebook",
                          "Zalo",
                          "Telegram",
                          "WhatsApp",
                          "Instagram",
                          "Viber",
                          "Skype",
                        ].map((platform, index) => (
                          <div
                            key={platform}
                            className="flex items-center justify-between p-3 bg-muted rounded-lg"
                          >
                            <span className="font-medium text-foreground">
                              {platform}
                            </span>
                            <Badge
                              variant={index < 6 ? "default" : "secondary"}
                              className={
                                index < 6
                                  ? "bg-green-500 hover:bg-green-600"
                                  : ""
                              }
                            >
                              {index < 6 ? "Online" : "Offline"}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
