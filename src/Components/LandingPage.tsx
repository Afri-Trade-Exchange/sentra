import { Link } from 'react-router-dom'

// ... other imports

function NavItem({ text, to }: { text: string; to: string }) {
  return (
    <Link to={to} className="cursor-pointer hover:text-orange-500 transition-colors">
      <span>{text}</span>
    </Link>
  )
}

// In the navigation section of LandingPage:
<NavItem text="I'm a Trader" to="/trader-signup" />
