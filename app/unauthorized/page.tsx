import Link from "next/link"
import { ShieldAlert, LogIn, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function UnauthorizedPage() {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-muted p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="text-center space-y-4">
                    <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center">
                        <ShieldAlert className="h-8 w-8 text-destructive" />
                    </div>
                    <CardTitle className="text-2xl font-bold">401 - Non autorisé</CardTitle>
                    <CardDescription className="text-base">
                        Vous devez être connecté pour accéder à cette page.
                        Veuillez vous authentifier pour continuer.
                    </CardDescription>
                </CardHeader>
                <CardContent className="text-center text-sm text-muted-foreground">
                    <p>
                        Si vous pensez qu&apos;il s&apos;agit d&apos;une erreur, veuillez contacter
                        l&apos;administrateur système.
                    </p>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                    <Button asChild className="w-full">
                        <Link href="/login">
                            <LogIn className="mr-2 h-4 w-4" />
                            Se connecter
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Retour à l&apos;accueil
                        </Link>
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
