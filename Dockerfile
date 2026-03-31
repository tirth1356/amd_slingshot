# =============================================
# Stage 1: Build React frontend
# =============================================
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --silent
COPY frontend/ .
ARG VITE_SUPABASE_URL
ARG VITE_SUPABASE_ANON_KEY
ARG VITE_API_BASE_URL=""
ENV VITE_SUPABASE_URL=$VITE_SUPABASE_URL
ENV VITE_SUPABASE_ANON_KEY=$VITE_SUPABASE_ANON_KEY
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL
RUN npm run build

# =============================================
# Stage 2: Node.js backend + serve frontend
# =============================================
FROM node:20-alpine
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production --silent
COPY backend/ .
COPY --from=frontend-build /app/frontend/dist ../frontend/dist

ENV NODE_ENV=production
ENV PORT=8080

EXPOSE 8080
CMD ["node", "server.js"]
