import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="p-10">
      <Card className="max-w-md">
        <CardContent className="p-6 space-y-4">
          <h1 className="text-xl font-semibold">Rummi CRM</h1>
          <p>Franchise Sales & Operations Platform</p>
          <Button>Login</Button>
        </CardContent>
      </Card>
    </div>
  )
}
