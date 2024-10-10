import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

export default async function middleware(request: NextRequest) {
  const tokenCookie = request.cookies.get("session");
  const token = tokenCookie?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/school-login", request.url));
  }

  try {
    await verifyToken(token);
    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(new URL("/school-login", request.url));
  }
}

export const config = {
  matcher: ["/school-dashboard/:path*"],
};

// import { NextRequest, NextResponse } from "next/server";
// import { verifyToken } from "@/lib/jwt";

// // Define role constants
// const ROLES = {
//   SCHOOL: "SCHOOL",
//   STUDENT: "STUDENT",
//   TEACHER: "TEACHER",
// };

// // Function to get the login page based on the role
// const getLoginPageForRole = (role: string): string => {
//   switch (role) {
//     case ROLES.SCHOOL:
//       return "/school-login";
//     case ROLES.STUDENT:
//       return "/student-login";
//     case ROLES.TEACHER:
//       return "/teacher-login";
//     default:
//       return "/";
//   }
// };

// // Function to get the required role for a given route
// const getRequiredRole = (pathname: string): string | null => {
//   if (pathname.startsWith("/school")) {
//     return ROLES.SCHOOL;
//   } else if (pathname.startsWith("/student")) {
//     return ROLES.STUDENT;
//   } else if (pathname.startsWith("/teacher")) {
//     return ROLES.TEACHER;
//   }
//   return null;
// };

// export default async function middleware(request: NextRequest) {
//   console.log("Middleware triggered"); // Debugging log
//   const tokenCookie = request.cookies.get("session");
//   const token = tokenCookie?.value;
//   const { pathname } = request.nextUrl;

//   const requiredRole = getRequiredRole(pathname);

//   // If the route requires a role and the role is null, skip validation
//   if (!requiredRole) {
//     return NextResponse.next();
//   }

//   if (!token) {
//     const loginPage = getLoginPageForRole(requiredRole);
//     return NextResponse.redirect(new URL(loginPage, request.url));
//   }

//   try {
//     // Verify the token and extract the role
//     const { role } = await verifyToken(token);
//     if (role !== requiredRole) {
//       const loginPage = getLoginPageForRole(requiredRole);
//       return NextResponse.redirect(new URL(loginPage, request.url));
//     }
//     return NextResponse.next();
//   } catch (error) {
//     console.error("Token verification failed:", error); // Log the error
//     const loginPage = getLoginPageForRole(requiredRole);
//     return NextResponse.redirect(new URL(loginPage, request.url));
//   }
// }

// export const config = {
//   matcher: [
//     "/school-dashboard/:path*",
//     "/student-dashboard/:path*",
//     "/teacher-dashboard/:path*",
//   ],
// };
