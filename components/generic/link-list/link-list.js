import Link from 'next/link'

export default function (props) {
  return (
    <>
      <div>
        <ul>
          {props.links.map((i) => (
            <li key={i.title}>
              <Link href={i.link}>
                <a title={i.title}>{i.title}</a>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <style jsx>
        {`
          ul {
            list-style: none;
            display: flex;
            flex-wrap: wrap;
          }

          li {
            margin-right: var(--edge-gap);
            margin-bottom: var(--edge-gap);
          }

          a {
            border: var(--light-border);
            padding: var(--edge-gap);
            color: var(--edge-link-color);
            text-decoration: none;
            display: block;
            border-radius: var(--edge-radius);
          }
        `}
      </style>
    </>
  )
}
