# Rota+

Rota+ e uma demo funcional de produto mobile para mobilidade acessivel sob demanda: um "Uber/99" focado em cadeirantes e pessoas com mobilidade reduzida.

## Como rodar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Contas demo

- Passageiro: `ana@rota.plus.demo` / `demo1234`
- Motorista: `carlos@rota.plus.demo` / `demo1234`
- Responsavel: `marina@rota.plus.demo` / `demo1234`
- Hospital: `hospital@rota.plus.demo` / `demo1234`

## O que esta implementado

- Landing page premium mobile com recursos, beneficios, funcionamento, depoimentos, estatisticas, FAQ e footer.
- Autenticacao mock com login, cadastro, recuperacao de senha, sessao persistida e logout.
- Dashboard de passageiro com perfil de acessibilidade, upload mock de verificacao PCD, mapa proprio simulado, veiculos proximos, tipos de servico, simulacao de corrida, SOS, compartilhamento, pagamento e avaliacao.
- Fluxo de motorista com onboarding, veiculo acessivel, uploads mock, treinamento, certificado, painel de corridas, ganhos, historico e reputacao.
- Modos extras: cuidador, hospital, comunidade, rotas acessiveis, locais acessiveis, favoritos, historico, notificacoes, configuracoes, modo escuro, offline e comandos por voz simulados.

## Experiencia mobile

O produto e mobile-only. Em telas grandes, a aplicacao aparece dentro de uma simulacao profissional de smartphone centralizada, mantendo a experiencia de app.

## Arquitetura

- `app/`: rotas Next.js App Router.
- `components/`: componentes estruturais, mapa e primitives de UI estilo shadcn/ui.
- `features/`: fluxos de produto por dominio.
- `context/`: stores Zustand persistidas.
- `data/`: banco mock local.
- `services/`: simulacoes de API, autenticacao, corridas e storage.
- `types/`: contratos TypeScript centrais.
- `hooks/`, `lib/`, `assets/`: suporte compartilhado.

Nenhuma API externa e usada. Mapa, pagamento, autenticacao, notificacoes, uploads e voz sao simulados localmente.
