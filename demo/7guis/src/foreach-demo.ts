import { Txt } from './components/txt'
import {
  attr,
  type Renderable,
  on,
  animate,
  prop,
  html,
  ForEach,
  OnDispose,
} from '@tempots/dom'
import { Button } from './ui'
import { flex } from './components/flex'

interface Account {
  name: string
  balance: number
}

function randomAccountBalance() {
  return Math.floor(Math.random() * 100000000) / 100
}

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
function randomAccountName(nameLength: number = 10) {
  return Array.from(
    { length: nameLength },
    () => ALPHABET[Math.floor(Math.random() * ALPHABET.length)]
  ).join('')
}

function randomAccount(): Account {
  return {
    name: randomAccountName(),
    balance: randomAccountBalance(),
  }
}

function makeAccounts(count: number): Account[] {
  return Array.from({ length: count }, randomAccount)
}

const VARIATION = 0.01
function getNewBalance(amount: number) {
  const variation = Math.random() * VARIATION
  return amount + (variation * amount) / 100
}

function easeOutCubic(p: number) {
  return 1 - Math.pow(1 - p, 3)
}

export function ForEachDemo(): Renderable {
  const $accounts = prop(makeAccounts(10))
  const $count = $accounts.map(v => v.length)
  const $deleteDisabled = $count.map(c => c === 0)

  function addAccounts(qt: number) {
    $accounts.update(a => [...a, ...makeAccounts(qt)])
  }

  function deleteAccounts(qt: number) {
    $accounts.update(a => a.slice(0, -qt))
  }

  function removeAccount(id: string) {
    $accounts.update(a => a.filter(i => i.name !== id))
  }

  function updateBalance(id: string, balance: number) {
    $accounts.update(a => a.map(i => (i.name === id ? { ...i, balance } : i)))
  }

  return flex.col(
    attr.class('gap-2 items-center'),
    flex.row(Txt($count.map(count => `Count: ${count}`))),
    flex.row(
      attr.class('gap-2'),
      Button(
        'Add 1',
        on.click(() => {
          addAccounts(1)
        })
      ),
      Button(
        'Add 10',
        on.click(() => {
          addAccounts(10)
        })
      ),
      Button(
        attr.disabled($deleteDisabled),
        'Delete 1',
        on.click(() => {
          deleteAccounts(1)
        })
      ),
      Button(
        attr.disabled($deleteDisabled),
        'Delete 10',
        on.click(() => {
          deleteAccounts(10)
        })
      )
    ),
    flex.col(
      attr.class('gap-2'),
      ForEach(
        $accounts,
        $account => {
          const duration = Math.random() * 2000 + 1000
          const newBalance = animate(
            10000,
            $account.at('balance').get,
            [$account],
            { duration: 1500, easing: easeOutCubic }
          )
          const timer = setInterval(() => {
            updateBalance(
              $account.value.name,
              getNewBalance($account.value.balance)
            )
          }, duration)
          return flex.row(
            OnDispose(() => {
              clearInterval(timer)
            }),
            attr.class('gap-2 justify-between items-center w-96'),
            Txt($account.at('name')),
            flex.row(
              attr.class('gap-2 items-center'),
              Txt(
                newBalance.map(v =>
                  v.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    maximumFractionDigits: 0,
                  })
                )
              ),
              Button(
                'Delete',
                on.click(() => {
                  removeAccount($account.value.name)
                })
              )
            )
          )
        },
        () => html.hr(attr.class('border-dashed'))
      )
    )
  )
}
