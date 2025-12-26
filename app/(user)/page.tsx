import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";

export default function UserHome() {
  return (
    <main className="min-h-screen px-6 py-16 flex flex-col items-center">
      <div className="max-w-4xl text-center space-y-6">
        <Badge variant="secondary" className="px-3 py-1 rounded-full">
          LearnNext · Blog Playground
        </Badge>

        <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
          Learn, Build, and Share your Journey
        </h1>

        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
          A simple yet thoughtful blogging space where ideas stretch their legs,
          drafts bloom into insights, and curiosity gets a seat at the table.
        </p>

        <div className="flex flex-wrap gap-3 justify-center pt-2">
          <Button size="lg" asChild>
            <Link href="/blog">Explore Articles</Link>
          </Button>

          <Button size="lg" variant="outline" asChild>
            <Link href="/create">Start Writing</Link>
          </Button>
        </div>

        <Separator className="my-8" />

        <Card className="overflow-hidden rounded-2xl border bg-gradient-to-br from-background to-muted/40">
          <CardContent className="p-0">
            <div className="relative w-full h-64 md:h-80">
              <Image
                src="https://images.unsplash.com/photo-1498079022511-d15614cb1c02?q=80"
                alt="LearnNext illustration"
                fill
                className="object-cover"
                sizes="100vw"
              />
            </div>

            <div className="p-6 md:p-8 space-y-2">
              <h2 className="text-xl font-semibold">
                A calm space for thoughtful writing
              </h2>

              <p className="text-muted-foreground leading-relaxed">
                Your posts are treated like postcards from the mind — crafted,
                preserved, and shared with intention.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
