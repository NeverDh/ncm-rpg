# HANDOFF

## Agent
PRODUCT_AGENT (modo análise — sem implementação de código neste ciclo)

## Objetivo
Registrar pedido do **owner** sobre **UI da criação de personagem**, **visibilidade de bônus raciais**, **feedback visual na distribuição de pontos**, **tela de confirmação**, **barras para atributos e status (HP, Mana, Stamina, Energia)** e regra de produto: **Energia (status) fixa em 20** no MVP, independente de raça, classe e atributos (base para economia/lucro futuros).

## Contexto da análise
- Estado atual (referência dev): blurbs de raça após escolha; atributos na distribuição sem destaque por “pontos investidos”; barra `attrProgressBar` global de pontos gastos; confirmação ainda mostra resumo “base, sem racial” e a barra 14/14 pode soar pesada ou redundante quando o pool está zerado.
- **Telegram** não oferece cor real (ex.: “verde”) no texto padrão; o equivalente de UX é **emoji**, **blocos Unicode** (█░), **alinhamento monoespaçado** ou **símbolos** acordados — o DEV deve validar leitura em Android/iOS/desktop.

## Requisitos funcionais / UX (para DEV)

1. **Raça — mostrar atributos (e impacto racial)**  
   - Na etapa de escolha de raça **ou** imediatamente após selecionar, o jogador deve ver **quais bônus/penalidades raciais** aplicam a **atributos** (e, se ainda existirem, bônus a recursos — ver item 5).  
   - Evitar depender só do texto longo do blur; preferir **linha compacta por raça** na tela de escolha (tabela resumida) **ou** bloco fixo ao escolher, sempre **consistente** com `racial-modifiers` / `MODULES`.

2. **Distribuição de pontos — “verde” / investimento visível**  
   - Por atributo: deixar explícito **quanto do pool foi colocado naquele atributo** (ex.: +0 … +7 sobre o mínimo 8).  
   - “Verde”: usar **metáfora visual** (🟩/⬜ ou ▰/░) com legenda curta no rodapé da mensagem, para não parecer bug em temas escuros.

3. **Confirmação — remover sensação de “14/14 feio”**  
   - Quando não há pontos restantes, **não** repetir barra global redundante; substituir por mensagem clara (“Distribuição concluída” / “Todos os pontos usados”) ou omitir a barra global e manter só o detalhe por atributo.  
   - Incluir **prévia dos atributos finais (base + racial)** e **prévia dos quatro status** com barras, para confiança antes de persistir.

4. **Atributos e status com barras “bonitas”**  
   - **HP, Mana, Stamina, Energia**: mesmo estilo de barra proporcional (escala definida pelo DEV: máximo referência = valor prévio máximo teórico no MVP ou normalização por classe na prévia — decisão técnica).  
   - **Energia**: na prévia e na ficha pós-criação, **sempre 20** e barra cheia (ou escala 0–20 fixa).

5. **Regra de produto — Energia fixa em 20**  
   - **Status Energia = 20** para todo personagem criado, **sem** variar por raça, classe ou atributos.  
   - Remover da narrativa de raciais qualquer “+X Energia” que sugira alterar esse status no MVP (alinhar `MODULES`, `bot.copy`, `racial-modifiers`, `CharacterService.finalize` e ADR se necessário).  
   - Manter **atributo Vigor** e demais fórmulas de HP/Mana/Stamina como estão, salvo revisão futura do owner.

## Arquivos afetados (previsão para DEV — não editados neste handoff)
- `src/bot/bot.presenter.ts`, `bot.service.ts`, `bot.copy.ts`, `bot.labels.ts`
- `src/modules/character/character.service.ts`, `class-bases.ts`, `racial-modifiers.ts`
- `docs/MODULES.md`, `decisions/DECISIONS.md` (se fechar regra Energia 20)
- Possível extrair helpers de formatação (`resource-bar`, `racial-summary`) para testes/manutenção

## Decisões tomadas (produto)
- Prioridade: **clareza na criação** > densidade de texto; **confiança na confirmação** (prévia final) > economia de mensagens.  
- **Energia 20 fixa** é decisão de produto vinculada a **economia futura**; não reabrir cálculo por atributo sem novo pedido do owner.

## Pendências
- DEV: implementar UI + alterar `finalize` para `energy = 20`; limpar `bonusEnergy` e copies obsoletos.  
- **TECH_LEAD / ADR**: registrar mudança de regra de Energia se o repositório exigir rastreabilidade.  
- **ANALYST** (opcional): checar se HP/Mana/Stamina ficam desbalanceados após Energia neutra.

## Riscos identificados
- Tabela de todas as raças na mesma mensagem pode **estourar limite de caracteres** do Telegram — pode precisar paginar ou resumo + detalhe após clique.  
- Barras proporcionais precisam de **escala** clara senão leitura confusa entre classes.

## Próximo agente recomendado
- **DEVELOPMENT_AGENT** — implementação + migração de dados se `energy` legado ≠ 20; depois **TECH_LEAD_AGENT** se tocar ADR.
