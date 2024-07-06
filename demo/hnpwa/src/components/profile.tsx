import { InnerHTML, Signal, Show } from '@tempots/dom'
import { User } from '../types'

export interface ProfileViewProps {
  user: Signal<User>
}

export const ProfileView = ({ user }: ProfileViewProps) => (
  <section className="user-view">
    <table>
      <tr>
        <td>user:</td>
        <td>
          <b>{user.at('id')}</b>
        </td>
      </tr>
      <tr>
        <td>created:</td>
        <td>{user.at('created')}</td>
      </tr>
      <tr>
        <td>karma:</td>
        <td>{user.at('karma')}</td>
      </tr>
      <Show when={user.at('about')}>
        {(about: Signal<string>) => (
          <tr>
            <td>about:</td>
            <td><InnerHTML html={about} /></td>
          </tr>
        )}
      </Show>
    </table>
  </section>
)
