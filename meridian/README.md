This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


I am a web developer with experience working on server side rendered websites. I used Typescript, React, & Fusion.js to build those sites. I geen tasked with making site Next.js, give me an overview of Next's core features and how to do basic tasks so I quickly get started.


I want to make a website that has a different design for mobile and web. How would I tipically accomplish this? 
I'm using Next.js, tailwind css, and schadcn. What would this look like using those tools?

Desktop (Keyboard input, Click input)
- priotiy sorted list with set a part item
- Actions: Edit, Dismiss, Snooze, Make Action


Mobile (Simulate Swipes [via keyboard], Touch input)
- Swipe Cards + Swipe Up Priority Sorted Lists

Badge, Button, SideBar

Focus on the single plus multiselect case.
The List

Actions Buttons

I've decided that:
-> Light Snooze: Color: Light Purple, Icon One: alarm-clock
-> Deep Snooze: Color: Dark Purple, Icon: alarm-clock-plus
-> Dismiss: Color: Red, Icon: circle-x
-> Make Action: Color: Blue, Icon: list-plus

Help me come up with a color palette for these actions. Account for accessibilty the UI should function in grey scale.


Card Closed state:
- Primary Data: Priorty, Category, Alerting Event
- Secondary Data: Suggestion Confidence, Suggested Action
All of this information is aligned to the right. The actions aligned to the center left.

We have not surfaced ID, Date, or Evidence

state:

props:
-primary
- - primary background color
- - primary stroke color
- - primary icon
-revert
- - revert stroke color
- - revert icon
- on click
- is toggled

function ActionButton()


On press the background
When revert mode background color is white, and the border is revert stroke color and the icon is revert stroke color. Border is tickened

When in primary 