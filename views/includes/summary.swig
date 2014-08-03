{% if summary %}
    {{ summary|resolveLinks|markdown }}
{% endif %}
