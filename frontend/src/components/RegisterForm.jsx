import { cn } from "@/lib/utils.js"
import { Button } from "@/components/ui/button"
import { Link  } from "react-router-dom"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState,useEffect } from "react"
import { apiFetch } from "@/api/apiFetch.js"
import { useNavigate } from "react-router-dom"
import { AlertCircleIcon } from "lucide-react"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { CheckCircle2Icon} from "lucide-react"
import { SpinnerCustom } from "./ui/spinner"

export function RegisterForm({
  className,
  ...props
}) {

  const navigate=useNavigate()
  const [name,setName]=useState("")
  const [email,setEmail]=useState("")
  const [confirmPassword,setConfirmPassword]=useState("")
  const [password,setPassword]=useState("")
  const [loading,setLoading]=useState(false)
  const [error,setError]=useState({
    title:"Error",
    description:"Error while signup!",
    type:"destructive",
    showAlert:false
  })

  const handleSubmit=async(e)=>{
    e.preventDefault()
    try {
      setLoading(true)
      if(password!=confirmPassword){
        setError({
          title:"Incorrect Password",
          description:"Passwords do not match.",
          type:"destructive",
          showAlert:true
        })
        setName("")
        setEmail("")
        setPassword("")
        setConfirmPassword("")
        return
      }
      const res=await apiFetch("/auth/register",{
        method:"POST",
        body:{
          name,
          email,
          password
        }
      })
      navigate("/login")
    } catch (error) {
        setError({
          title:"Signup error",
          description:
            error?.response?.data?.errors?.[0]?.message ||
            error?.response?.data?.message ||
            error?.message ||
            "Something went wrong",
          type:"destructive",
          showAlert:true
        })
    }finally{
      setLoading(false)
    }
  }
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {error.showAlert && (
        <Alert variant={error.type} className="max-w-md">
          {error.type == "default" ? <CheckCircle2Icon /> : <AlertCircleIcon />}
          <AlertTitle>{error.title}</AlertTitle>
          <AlertDescription>{error.description}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Create your account</CardTitle>
          <CardDescription>
            Enter your email below to create your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Full Name</FieldLabel>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  required
                  onChange={(e) => {
                    setName(e.target.value);
                  }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                />
              </Field>
              <Field>
                <Field className="grid grid-cols-2 gap-4">
                  <Field>
                    <FieldLabel htmlFor="password">Password</FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      required
                      onChange={(e) => {
                        setPassword(e.target.value);
                      }}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="confirm-password">
                      Confirm Password
                    </FieldLabel>
                    <Input
                      id="confirm-password"
                      type="password"
                      required
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                      }}
                    />
                  </Field>
                </Field>
                <FieldDescription>
                  Must be at least 8 characters long.
                </FieldDescription>
              </Field>
              <Field>
                <Button type="submit" disabled={loading}>
                  {loading && <SpinnerCustom />}
                  {loading ? "Creating Account..." : "Create Account"}
                </Button>
                <FieldDescription className="text-center">
                  Already have an account? <Link to="/login">Sign in</Link>
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <FieldDescription className="px-6 text-center">
        By clicking continue, you agree to our Terms of Service and Privacy
        Policy.
      </FieldDescription>
    </div>
  );
}
