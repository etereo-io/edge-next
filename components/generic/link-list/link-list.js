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
            margin-right: var(--empz-gap);
            margin-bottom: var(--empz-gap);
          }

          a {
            border: var(--light-border);
            padding: var(--empz-gap);
            color: var(--empz-link-color);
            text-decoration: none;
            display: block;
          }
        `}
      </style>
    </>
  )
}
