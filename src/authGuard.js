import { isTokenValid } from "./verificaToken";

export default function (to, from, next) {
  // Verificar se o usuário está autenticado
  const isAuthenticated = isTokenValid()

  if (isAuthenticated) {
    // Se o usuário estiver autenticado, permitir o acesso à rota
    next();
  } else {
    // Se o usuário não estiver autenticado, redirecionar para a página de login
    next('/');
  }
}
